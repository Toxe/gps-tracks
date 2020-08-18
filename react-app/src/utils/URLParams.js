export function getSearchParam(searchParams, name, altValue) {
    const value = searchParams.get(name);

    return value !== undefined && value !== null ? value : altValue;
}
