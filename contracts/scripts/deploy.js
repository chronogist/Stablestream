const hre = require("hardhat");

async function main() {
  const Stablestream = await hre.ethers.getContractFactory("Stablestream");
  const stablestream = await Stablestream.deploy();

  await stablestream.waitForDeployment();
  const address = await stablestream.getAddress();

  console.log("Stablestream deployed to:", address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
