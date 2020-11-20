export function spyOnHook(hookExport) {
    return jest.spyOn(hookExport, "default");
}
