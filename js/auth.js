import { supabase } from "./supabase.js";

export async function verificarLogin() {

    const {
        data: { session }
    } = await supabase.auth.getSession();

    if (!session) {
        window.location.href = "../pages/login.html";
    }

}