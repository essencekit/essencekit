export default [
    {
        name: 'title-required',
        description: 'Component config must have a title.',
        check(html, component) {
            if (!component?.config?.title) {
                return `Missing title in component: ${component.name}`;
            }
        }
    },
    {
        name: 'description-required',
        description: 'Component config must have a description.',
        check(html, component) {
            if (!component?.config?.description) {
                return `Missing description in component: ${component.name}`;
            }
        }
    }
];