import { toast as originalToast, ToastOptions } from 'react-toastify';

const SUCCESS_OPTS: ToastOptions = {
	autoClose: 1500,
};

const INFO_OPTS: ToastOptions = {
	autoClose: 2500,
};

export const toast = {
	success: (msg: string) => originalToast.success(msg, SUCCESS_OPTS),
	error: (msg: string) => originalToast.error(msg),
	info: (msg: string) => originalToast.info(msg, INFO_OPTS),
};










