// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Stablestream {
    using SafeERC20 for IERC20;

    struct Stream {
        address sender;
        address recipient;
        address token;
        uint256 deposit;
        uint256 ratePerSecond;
        uint256 startTime;
        uint256 stopTime;
        uint256 withdrawnAmount;
        bool cancelled;
    }

    uint256 public nextStreamId;
    mapping(uint256 => Stream) public streams;
    mapping(address => uint256[]) public senderStreamIds;

    event StreamCreated(
        uint256 indexed streamId,
        address indexed sender,
        address indexed recipient,
        address token,
        uint256 deposit,
        uint256 ratePerSecond,
        uint256 startTime,
        uint256 stopTime
    );

    event StreamWithdrawn(
        uint256 indexed streamId,
        address indexed recipient,
        uint256 amount
    );

    event StreamCancelled(
        uint256 indexed streamId,
        address indexed sender,
        uint256 refundAmount
    );

    function createStream(
        address _recipient,
        address _token,
        uint256 _ratePerSecond,
        uint256 _startTime,
        uint256 _duration
    ) external returns (uint256) {
        require(_recipient != address(0), "recipient is zero address");
        require(_recipient != msg.sender, "recipient is sender");
        require(_ratePerSecond > 0, "rate is zero");
        require(_duration > 0, "duration is zero");
        require(_startTime >= block.timestamp, "start time in past");

        uint256 deposit = _ratePerSecond * _duration;
        require(deposit > 0, "deposit is zero");

        IERC20(_token).safeTransferFrom(msg.sender, address(this), deposit);

        uint256 streamId = nextStreamId++;
        uint256 stopTime = _startTime + _duration;
        
        streams[streamId] = Stream({
            sender: msg.sender,
            recipient: _recipient,
            token: _token,
            deposit: deposit,
            ratePerSecond: _ratePerSecond,
            startTime: _startTime,
            stopTime: stopTime,
            withdrawnAmount: 0,
            cancelled: false
        });

        senderStreamIds[msg.sender].push(streamId);

        emit StreamCreated(
            streamId,
            msg.sender,
            _recipient,
            _token,
            deposit,
            _ratePerSecond,
            _startTime,
            stopTime
        );

        return streamId;
    }

    function withdrawFromStream(uint256 _streamId, uint256 _amount) external {
        Stream storage stream = streams[_streamId];
        require(stream.recipient == msg.sender, "not recipient");
        require(!stream.cancelled, "stream cancelled");

        uint256 available = getAvailableBalance(_streamId);
        require(_amount <= available, "exceeds available");

        stream.withdrawnAmount += _amount;
        IERC20(stream.token).safeTransfer(msg.sender, _amount);

        emit StreamWithdrawn(_streamId, msg.sender, _amount);
    }

    function cancelStream(uint256 _streamId) external {
        Stream storage stream = streams[_streamId];
        require(stream.sender == msg.sender, "not sender");
        require(!stream.cancelled, "already cancelled");

        uint256 refundable = getAvailableBalance(_streamId);
        stream.cancelled = true;

        if (refundable > 0) {
            IERC20(stream.token).safeTransfer(stream.sender, refundable);
        }

        emit StreamCancelled(_streamId, msg.sender, refundable);
    }

    function getAvailableBalance(uint256 _streamId) public view returns (uint256) {
        Stream storage stream = streams[_streamId];
        
        if (stream.cancelled) {
            return 0;
        }

        uint256 currentTime = block.timestamp;
        
        if (currentTime < stream.startTime) {
            return 0;
        }

        uint256 stopTime = stream.stopTime;
        
        if (currentTime >= stopTime) {
            return stream.deposit - stream.withdrawnAmount;
        }

        uint256 elapsed = currentTime - stream.startTime;
        uint256 earned = elapsed * stream.ratePerSecond;
        
        if (earned >= stream.deposit) {
            return stream.deposit - stream.withdrawnAmount;
        }

        return earned - stream.withdrawnAmount;
    }

    function getSenderStreams(address _sender) external view returns (uint256[] memory) {
        return senderStreamIds[_sender];
    }
}
