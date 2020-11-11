import { useAuth } from "../../../../Auth";

export default function useHeader() {
    const { authId } = useAuth();

    return { authId };
}
