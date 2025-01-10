// app/agenda/page.jsx

import Agenda from "@/components/Agenda";
import Header from "@/components/Header";
const AgendaPage = () => {
    return (
        <div>
            <Header page={"agenda"} />
            <Agenda />;
        </div>
    );
}

export default AgendaPage;
