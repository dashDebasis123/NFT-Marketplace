const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
    content: ["./src/**/*.{html,js}"],
    theme: {
        extend: {
            colors: {
                black: {
                    color: "text-black",
                },
            },
        },
    },
    plugins: [],
});
