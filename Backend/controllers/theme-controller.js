const {prisma} = require("../prisma/prisma-client");

const ThemeController = {
    getAllThemes: async (req, res) => {
        try {
            const themes = await prisma.theme.findMany();

            res.json(themes);
        } catch (error) {
            console.error('err', error)
            res.status(500).json({error: error});
        }
    }
}

module.exports = ThemeController;