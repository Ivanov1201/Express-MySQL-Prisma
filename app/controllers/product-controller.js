const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.buyProduct = async function (req, res) {
  try {
    const { id, address } = req.body;
    const catalog = await prisma.catalog.findFirst({
      where: {
        ID: {
          equals: parseInt(id),
        },
      },
    });
    const user = await prisma.user.findFirst({
      where: {
        address: {
          equals: address,
        },
      },
    });
    const assets = await prisma.asset.findMany({
      where: {
        address: {
          equals: address,
        },
      },
    });
    if (catalog === null || user === null) {
      return res.status(404).json({ errorMessage: "error occured ..." });
    }
    let errorMessage = null;
    if (
      user.cash1 < catalog.cost1 ||
      user.cash2 < catalog.cost2 ||
      user.cash3 < catalog.cost3
    ) {
      errorMessage = `User doesn't have enough cash.`;
    } else {
      let requirements = [];
      if (catalog.req1 !== null)
        requirements.push({ index: 1, value: catalog.req1 });
      if (catalog.req2 !== null)
        requirements.push({ index: 2, value: catalog.req2 });
      if (catalog.req3 !== null)
        requirements.push({ index: 3, value: catalog.req3 });
      for (requirement of requirements) {
        let sub_assets = assets.filter(
          (asset) => asset.type == requirement.index
        );
        if (sub_assets.length === 0) {
          // There is no asset whose type is X
          errorMessage = `User doesn't meet req${requirement.index}.`;
          break;
        }
        let flag = false;
        ///////////
        // Only one asset exists to the given type and address? If not, what to do? I did iterate all the assets and if one of them has the higher level, then that is OK.
        ///////////
        for (asset of sub_assets) {
          if (asset.level >= requirement.value) flag = true;
        }
        if (!flag) {
          // All assets whose type is X have the lower level than req
          errorMessage = `User doesn't meet req${requirement.index}.`;
          break;
        }
      }
    }

    if (errorMessage === null) {
      // If the user meets all the requirements
      const updatedUser = await prisma.user.update({
        where: {
          address: address,
        },
        data: {
          cash1: {
            decrement: catalog.cost1,
          },
          cash2: {
            decrement: catalog.cost2,
          },
          cash3: {
            decrement: catalog.cost3,
          },
        },
      });
      const createdProduct = await prisma.product.create({
        data: {
          id: parseInt(id),
          address: address,
        },
      });

			return res.status(200).json({ 
				success: true,
				data: {
					resources: {
						cash1: updatedUser.cash1,
						cash2: updatedUser.cash2,
						cash3: updatedUser.cash3,
					} 
				}
			});
    }

    return res.status(200).json({ 
			success: false,
			error:{
				errorMessage: errorMessage
			}
		});
  } catch (error) {
	return res.status(500).json({ errorMessage: error.message, });
  }
};
