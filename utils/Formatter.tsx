export default class Formatter {
    static formatDuration = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    static slugify(text: string) {
        return text
            // Normalize the string
            .normalize("NFD")
            // Remove accent marks
            .replace(/[\u0300-\u036f]/g, "")
            // Replace all spaces with hyphens
            .replace(/\s+/g, "-")
            // Remove all non-word chars
            .replace(/[^\w\-]+/g, "")
            // Replace multiple hyphens with a single hyphen
            .replace(/\-\-+/g, "-")
            // Convert to lowercase
            .toLowerCase();
    }
}
