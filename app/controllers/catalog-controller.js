const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

module.exports.getCatalog = async function (req, res) {
    const catalog = await prisma.catalog.findFirst({});
    if (catalog === null) {
        return res.status(404).json({ errorMessage: 'error occured ...' });
    }
    let result = {
        id: catalog.ID,
        name: catalog.name,
        description: catalog.description,
        imageUrl: catalog.url,
        price: {
            cost1: catalog.cost1,
            cost2: catalog.cost2,
            cost3: catalog.cost3,
        },
        req: {
            req1: catalog.req1,
            req2: catalog.req2,
            req3: catalog.req3,
        }
    }
    return res.status(200).json(result);
}