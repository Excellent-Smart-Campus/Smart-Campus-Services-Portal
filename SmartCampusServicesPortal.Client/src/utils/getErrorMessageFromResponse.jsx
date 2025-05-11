import {errorMessages} from "@/utils/errorMessages.jsx";

export function getErrorMessageFromResponse(error) {
    const status = error?.response?.status;
    const serverMessage = error?.response?.data?.message;

    switch (status) {
        case 400:
            return serverMessage || errorMessages.errorBadRequest;
        case 401:
            return serverMessage || errorMessages.errorUnAuthorize;
        case 403:
            return serverMessage || errorMessages.errorForbidden;
        case 404:
            return serverMessage || errorMessages.errorNotFound;
        case 500:
            return serverMessage || errorMessages.errorServer;
        default:
            return serverMessage || errorMessages.errorDefault;
    }
}
