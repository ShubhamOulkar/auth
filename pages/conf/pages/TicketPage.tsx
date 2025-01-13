import TicketHeader from "../components/page headers/TicketHeader";
import Ticket from "../components/Ticket";
import { usePictureContext } from "../picture context/createPictureContext";

export default function TicketPage() {
  const { userData } = usePictureContext();

  if (!userData.fullName) {
    return (
      <div className="ticket-page">
        <h1>Invalid request</h1>
      </div>
    );
  }
  return (
    <div className="ticket-page">
      <TicketHeader />
      <Ticket />
    </div>
  );
}
