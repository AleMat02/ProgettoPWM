import { FormGroup } from "@angular/forms";

export function isFormFieldInvalid(form: FormGroup<any>, field: string): boolean {
    const control = form.get(field);
    if (!control) { return false; }

    // Considera il campo non valido se il controllo stesso è non valido e toccato/sporco
    let isInvalid = control.invalid && (control.dirty || control.touched);

    // Caso speciale per 'confirmPassword': lo consideriamo non valido anche se c'è un errore di 'passwordMismatch'
    // a livello di form e almeno uno dei campi password è stato toccato.
    if (field === 'confirmPassword') {
        const passwordControl = form.get('password');
        if (form.hasError('passwordMismatch') && (control.touched || passwordControl?.touched)) {
            return true; // Sovrascrive isInvalid se c'è un mismatch e i campi rilevanti sono stati toccati
        }
    }
    return isInvalid;
}

export function getFormErrorMessage(form: FormGroup<any>, field: string): string | null {
    const control = form.get(field);
    if (!control) return null;

    if (field === 'confirmPassword' && form.hasError('passwordMismatch')) {
        const passwordControl = form.get('password');
        // Mostra l'errore di mismatch solo se 'confirmPassword' o 'password' sono stati toccati
        if (control.touched || passwordControl?.touched) {
            return 'Le password non coincidono.';
        }
    }

    if (control.errors) {
        if (control.errors['required']) return 'Questo campo è obbligatorio.';
        if (control.errors['email']) return "Inserisci un'email valida.";
        if (control.errors['minlength']) return `E' necessario inserire almeno ${control.errors['minlength'].requiredLength} caratteri.`;
        if (control.errors['maxlength']) return `E' consentito inserire al massimo ${control.errors['maxlength'].requiredLength} caratteri.`;
        if (control.errors['pattern']) return 'Formato non valido.';
    }
    return null;
}