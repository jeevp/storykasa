import {STK_ACCESS_TOKEN} from "../config";

export default function generateHeaders() {
    return {
        headers: {
            "access-token": localStorage.getItem(STK_ACCESS_TOKEN),
        }
    }
}
