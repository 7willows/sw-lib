import { prefixForConstSize } from "./strings";
import { tr } from './tr';

export function timestampToHumanDate(timestamp: number) {
    const date = new Date(timestamp);

    const day = prefixForConstSize(date.getDate().toString(), 2, '0');
    const month = prefixForConstSize((date.getMonth() + 1).toString(), 2, '0');
    const year = date.getFullYear().toString();

    return `${day}.${month}.${year}`;
}

export function timestampToHumanDateTime(timestamp: number) {
    const date = new Date(timestamp);

    const day = date.getDate();
    const month = tr('month.' + (date.getMonth() + 1));
    const year = date.getFullYear();

    const hours = prefixForConstSize(date.getHours().toString(), 2, '0');
    const minutes = prefixForConstSize(date.getMinutes().toString(), 2, '0');
    const seconds = prefixForConstSize(date.getSeconds().toString(), 2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}:${seconds}`;
}

export function timestampToHumanTime(timestamp: number) {
    return new Date(timestamp).toTimeString().slice(0, 5);
}
