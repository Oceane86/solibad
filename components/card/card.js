import React from "react";
import styles from "./Card.module.css";
import {useRouter} from "next/navigation";

const Card = ({ id, title, startDate, endDate, imageURL }) => {
    const router = useRouter();
    let statusContent = "";
    let messageDate = "";
    const estDateValide = (date) => {
        return !isNaN(Date.parse(date));
    };

    if (estDateValide(startDate) && estDateValide(endDate)) {
        const debut = new Date(startDate);
        const fin = new Date(endDate);

        if (debut > Date.now()) {
            statusContent = "⚫ À venir";
            messageDate = "Cette enchère ne commence que le " + debut.toLocaleDateString();
        } else if (fin < Date.now()) {
            statusContent = "🔴 Terminé";
            messageDate = "Cette enchère est terminée.";
        } else {
            statusContent = "🟢 En cours";
            messageDate = "Du " + debut.toLocaleDateString() + " au " + fin.toLocaleDateString();
        }
    } else {
        statusContent = "❌ Date invalide";
        messageDate = "Les dates fournies ne sont pas valides.";
    }

    const handleClick = () => {
        router.push(`/detail/${id}`);
    };

    return (
        <a onClick={handleClick}>
            <div className={styles.card}>
                <img src={imageURL} alt={title} className={styles.image} />
                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.limitDate}>{messageDate}</p>
                    <p className={styles.status}>{statusContent}</p>
                </div>
            </div>
        </a>
    );
};

export default Card;
