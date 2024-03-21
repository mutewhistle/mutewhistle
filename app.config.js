export default ({ config }) => ({
    ...config,
    icon: useAssets(require('./icon.png?raw=true'))
    ,
    splash: {
        image:
            useAssets(require('./splash.png?raw=true')),
        resizeMode: "contain",
        backgroundColor: "#ffffff",
    },
});