/**
 * Types support — création de ticket par un client connecté.
 *
 * Le ticket est attaché au compte de la session côté serveur (le nom du
 * demandeur est résolu depuis la session, jamais fourni par le formulaire).
 */
/** Demande de support / contact (réservée à l'utilisateur connecté). */
interface CreateTicketInput {
    /** Objet court du message. */
    subject: string;
    /** Corps du message. */
    description: string;
    /** Email de réponse souhaité (peut différer de l'email de connexion). */
    email: string;
}

export type { CreateTicketInput as C };
