import React from "react";
import styles from "./Card.module.css";

const Card = ({ id, title, limitDate, imageUrl, status }) => {
    let statusContent = "";
    if (status === "En cours") {
        statusContent = "🟢 En cours";
        limitDate = "Jusqu'au " + limitDate;
    } else if (status === "A venir") {
        statusContent = "⚫ A venir";
        limitDate = "À partir du " + limitDate;
    } else {
        statusContent = "🔴 Terminé";
        limitDate = "Terminé le " + limitDate;
    }

    return (
        <a href={`/detail?id=${id}`}>
                <div className={styles.card}>
                <img src={imageUrl} alt={title} className={styles.image} />
                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.limitDate}>{limitDate}</p>
                    <p className={styles.status}>{statusContent}</p>
                </div>
            </div>
        </a>
    );
};

export default Card;
