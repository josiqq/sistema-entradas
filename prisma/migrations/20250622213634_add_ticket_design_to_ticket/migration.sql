-- AlterTable
ALTER TABLE "Tickets" ADD COLUMN     "ticket_design_id" TEXT;

-- AddForeignKey
ALTER TABLE "Tickets" ADD CONSTRAINT "Tickets_ticket_design_id_fkey" FOREIGN KEY ("ticket_design_id") REFERENCES "TicketDesign"("id") ON DELETE SET NULL ON UPDATE CASCADE;
