export function validateEmail(email: string) {
    let reg = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/;
    return email && reg.test(email);
}

export function validateInputPassword(val: string, oldVal = "") {
    if (oldVal && val === oldVal) {
        return false;
    }
    let reg = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})/;
    return val && reg.test(val);
}

export function validateName(val: string) {
    let reg = /[a-zA-Z0-9]{3,}$/;
    return val && reg.test(val);
}

export function validatePhoneNumber(val: string) {
    // US phone number format
    let reg = /^(\+1)?[-.\s]?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}$/;
    return val && reg.test(val);
}

export function validateCMND(val: string) {
    const pattern = /^[0-9]{12}$/;
    return val && pattern.test(val);
}