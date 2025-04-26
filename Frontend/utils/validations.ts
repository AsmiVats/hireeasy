export const validateSignup = {
  name: (value: string) => {
    if (!value) return "Name is required";
    if (value.length < 2) return "Name must be at least 2 characters";
    return "";
  },
  email: (value: string) => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Invalid email format";
    return "";
  },
  password: (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    if (!/(?=.*[a-z])/.test(value)) return "Password must include lowercase letter";
    if (!/(?=.*[A-Z])/.test(value)) return "Password must include uppercase letter";
    if (!/(?=.*\d)/.test(value)) return "Password must include number";
    return "";
  },
  phone: (value: string) => {
    if (!value) return "Contact number is required";
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    if (!phoneRegex.test(value)) return "Invalid phone number format";
    return "";
  },
  companyName: (value: string) => {
    if (!value) return "Company name is required";
    if (value.length < 2) return "Company name must be at least 2 characters";
    return "";
  }
};