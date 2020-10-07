export function getSearchParam(searchParams, name, altValue) {
    const value = searchParams.get(name);

    return value !== undefined && value !== null ? value : altValue;
}

export function setOrRemoveDefaultSearchParam(searchParams, param, value, defaultValue) {
    if (value === defaultValue)
        searchParams.delete(param);
    else
        searchParams.set(param, value);
}
