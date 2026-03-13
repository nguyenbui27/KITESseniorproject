import moment from "moment";
import Constants from "../../core/common/constants";
import { API_BASE_URL } from "../../core/api/baseUrl";
const baseURL = API_BASE_URL;

export const validateFields = (isImplicitChange: boolean, key: any, isCheck: boolean, setError: Function, error: any, message: string) => {
    if (isImplicitChange) {
        error[key] = {
            isError: isCheck,
            message: message,
        };
    }
    else {
        setError({
            ...error,
            [key]: {
                isError: isCheck,
                message: message,
            }
        });
    }
};

export const convertDate = (date: any) => {
    if (date) {
        let dateFormat = new Date(date);
        return moment(dateFormat).format("DD-MM-YYYY hh:mm:ss");
    } return null;
};

export const convertDateOnly = (date: any, reverse?: boolean) => {
    if (date) {
        let dateFormat = new Date(date);
        if (reverse) {
            return moment(dateFormat).format("YYYY-MM-DD");
        }
        return moment(dateFormat).format("DD/MM/YYYY");
    } return null;
};

export const convertTimeOnly = (date: string) => {
    if (date) {
        let dateFormat = new Date(date);
        return moment(dateFormat).format("hh:mm");
    } return null;
};

export const convertTimeParams = (date: string) => {
    if (date) {
        const inputDate = new Date(date);
        const year = inputDate.getFullYear();
        const month = inputDate.getMonth() + 1;
        const day = inputDate.getDate();
        const hours = inputDate.getHours();
        const minutes = inputDate.getMinutes();
        const seconds = inputDate.getSeconds();
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        return formattedDate;
    } return null;
};

export const genderConfig = (gender: string) => {
    if (gender == Constants.Gender.MALE.value) {
        return Constants.Gender.MALE.label;
    }
    else if (gender == Constants.Gender.FEMALE.value) {
        return Constants.Gender.FEMALE.label;
    }
}

export const configImageURL = (image: string) => {
    if (image) {
        return `${baseURL}/files/preview/${image}`;
    }
    return "";
}

export const configImageURLIncludeHTTP = (image: string) => {
    if (image.includes("http")) {
        return image;
    }
    if (image) {
        return `${baseURL}/uploads/${image}`;
    }
    return "";
}
