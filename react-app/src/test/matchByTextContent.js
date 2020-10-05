export function matchByTextContent(queryText) {
    return (content, node) => {
        const textContentMatches = (node) => node.textContent === queryText;
        const childWithMatch = Array.from(node.children).find((childNode) => textContentMatches(childNode));

        return childWithMatch === undefined && textContentMatches(node);
    };
}
