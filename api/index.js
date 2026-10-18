// Vercel serverless entry point
// Dynamically imports the ES module Express app
module.exports = async (req, res) => {
    const { default: app } = await import('../server/server.js');
    return app(req, res);
};
