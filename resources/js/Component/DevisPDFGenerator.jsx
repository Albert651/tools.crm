import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import logo from '../Component/Image/bg-erp.png';

const DevisPDFGenerator = (devisData) => {
  if (!devisData) {
    console.error('Aucune donnée de devis fournie');
    return;
  }

  const doc = new jsPDF();
  
  // Ajout du logo
  doc.addImage(logo, 'PNG', 140, 9, 30, 30, );
  
  // Titre "DEVIS"
  doc.setFont("helvetica", "bold");
  doc.setFontSize(32);
  doc.text("DEVIS", 20, 30);
  
  // Informations d'en-tête
  doc.setFontSize(11);
  doc.text("DE", 20, 50);
  doc.text("DEVIS N°: " + devisData.reference, 120, 50);
  doc.text(devisData.entreprise, 20, 60);
  doc.text("DATE DU DEVIS: " + devisData.date, 120, 60);
  doc.text(devisData.adresse, 20, 70);
  doc.text(devisData.code + " " + devisData.pays, 20, 80);
  
  // Table des articles
  const tableColumn = ["QTE", "DESIGNATION", "PRIX UNIT. HT", "MONTANT HT"];
  const tableRows = [[
    devisData.quantiter,
    devisData.designation,
    `${devisData.prix_unitaire} ${devisData.unite}`,
    `${devisData.montant} ${devisData.unite}`
  ]];
  
  // Calculs
  const totalHT = parseFloat(devisData.montant);
  const tva = totalHT * 0.20;
  const totalTTC = totalHT + tva;
  
  // Génération de la table
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 90,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [114, 160, 193], // Correspond à #72A0C1
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
  });
  
  // Ajout des totaux
  let finalY = doc.previousAutoTable.finalY + 10;
  
  doc.text("Total HT:", 120, finalY);
  doc.text(`${totalHT.toFixed(2)} ${devisData.unite}`, 170, finalY);
  
  doc.text("TVA 20%:", 120, finalY + 10);
  doc.text(`${tva.toFixed(2)} ${devisData.unite}`, 170, finalY + 10);
  
  doc.setFont("helvetica", "bold");
  doc.text("TOTAL TTC:", 120, finalY + 20);
  doc.text(`${totalTTC.toFixed(2)} ${devisData.unite}`, 170, finalY + 20);
  
  // Conditions de paiement
  finalY += 40;
  doc.setFont("helvetica", "bold");
  doc.text("CONDITIONS ET MODALITÉS DE PAIEMENT", 20, finalY);
  doc.setFont("helvetica", "normal");
  doc.text("Le paiement est dû dans 15 jours", 20, finalY + 10);
  doc.text("Compte d'Entreprise:", 20, finalY + 20);
  doc.text("IBAN: FR76 1234 5678", 20, finalY + 30);
  doc.text("SWIFT/BIC: ABCDEFGHXXX", 20, finalY + 40);
  
  // Sauvegarde du PDF
  doc.save(`Devis-${devisData.reference}.pdf`);
};

export default DevisPDFGenerator;