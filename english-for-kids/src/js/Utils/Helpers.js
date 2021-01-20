const Helpers = {
    parseRequestURL: (myUrl) => {
        // eslint-disable-next-line no-restricted-globals
        const url = location.hash.slice(1).toLowerCase() || "/";
        const [, resource, id, verb] = url.split("/");
        return {
            resource,
            id,
            verb,
        };
    },
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};
export default Helpers;
