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
    },
    getThemeById: async (req, res) => {
        const {id} = req.params;

        try {
            const theme = await prisma.theme.findUnique({
                where: {id: id},
            });

            if (!theme) {
                res.status(404).json({error: "Тема не найдена"})
            }

            res.status(200).json({theme});
        } catch (e) {
            console.error(e);
            res.status(500).json({error: e});
        }
    }
}

module.exports = ThemeController;