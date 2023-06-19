import './App.css';
import jsPDF from 'jspdf'
import React, { useState } from 'react';
// import html2canvas from 'html2canvas';
import QRCode from 'qrcode';
import imageUrl from './assests/SmartPaperLogo.jpeg';

export default function App() {

  const [pdfUrl, setPdfUrl] = useState('');

  const jsonData = [
    { question: "3 X 70 =", answer: "" },
    { question: "30 X 7 =", answer: "" },
    { question: "40 X 6 =", answer: "" },
    { question: "30 X 6 =", answer: "" },
    { question: "70 X 7 =", answer: "" },
    { question: "4 X 70 =", answer: "" },
    { question: "2 X 70 =", answer: "" },
    { question: "80 X 7 =", answer: "" },
    { question: "40 X 8 =", answer: "" },
    { question: "2 X 60 =", answer: "" },
    { question: "90 X 4 =", answer: "" },
    { question: "4 X 50 =", answer: "" },
    { question: "40 X 6 =", answer: "" },
    { question: "30 X 6 =", answer: "" },
    { question: "70 X 7 =", answer: "" },
    { question: "4 X 70 =", answer: "" },
    { question: "2 X 70 =", answer: "" },
    { question: "80 X 7 =", answer: "" },
    { question: "40 X 8 =", answer: "" },
    { question: "2 X 60 =", answer: "" },
    { question: "90 X 4 =", answer: "" },
    { question: "4 X 50 =", answer: "" },

  ];

  type PdfItemProps = {
    question: string;
    answer: string;
  };
  
  const PdfItem: React.FC<PdfItemProps> = ({ question, answer }) => {
    return (
      <div style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <div>{question}</div>
        <div>{answer}</div>
      </div>
    );
  };  

  // #tileWidth = this.#doc.internal.pageSize.getWidth();
  // #tileHeight = this.#doc.internal.pageSize.getHeight();
  const handleGeneratePDF = async () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const startX1 = 30;
    const startX2 = 300;
    // const startX3 = 390;
    let startY = 170;
  
    // pdf.setFontSize(18).setFont('helvetica', 'bold');
    // pdf.text('Multiply multiples of 10 and 1 digit numbers', startX1, startY);
    // startY += 30;
  
    // pdf.setFontSize(12).setFont('helvetica', 'bold');
    // pdf.text('NAME:', startX1, startY);
    // pdf.rect(startX1 + 50, startY - 18, 150, 30);
    // startY += 40;
    // pdf.text('ROLL NO: ', startX1, startY);
    // pdf.rect(startX1 + 70, startY - 18, 100, 30);

    pdf.setFontSize(30).setFont("helvetica", "bold");
    pdf.text("Two-Digit Multiplication", 128, 45); //27...>184
    
    pdf.setFontSize(15).setFont("helvetica", "normal");
    pdf.text("Name:", 20, 100);
    pdf.setLineWidth(2);
    pdf.rect(70, 80, 140, 30);
    pdf.text("RollNo:", 230, 100);
    pdf.rect(285, 80, 80, 30);
    pdf.text("Date:", 390, 100);
    pdf.rect(430, 80, 100, 30);
    pdf.setFontSize(17);
    pdf.text("Multiply The Numbers!", 20, 160);
    pdf.setLineWidth(3);
    pdf.setDrawColor(112, 112, 112);
    pdf.line(0, 190, 599, 190);
    pdf.setLineWidth(1);
  
    const itemPositions:any = [];
  
    let currentY = startY + 20;
    
    const qrCodes = await Promise.all([
      QRCode.toDataURL('https://example.com/qr1'), 
      QRCode.toDataURL('https://example.com/qr1'), 
      QRCode.toDataURL('https://example.com/qr1'), 
      QRCode.toDataURL('https://example.com/qr1'), 
    ]);
    
    jsonData.forEach((item, index) => {
      const { question, answer } = item;
      
      let currentX;
      
      if (index % 2 === 0) {
        currentY += 50;
        currentX = startX1;
      } else {
        currentX = startX2;
      }
  
      pdf.setFontSize(22).setFont('helvetica', 'bold');
      pdf.setTextColor(144,144,144);
      pdf.text(`Q ${index+1}:`, currentX, currentY);
      pdf.setTextColor(0,0,0)
      if(index<9){
        pdf.text(question, currentX+50, currentY);
      }
      else{
        pdf.text(question, currentX+60, currentY);
      }

      const questionWidth = pdf.getTextWidth(question);
      const answerWidth = 100;
      
      const answerX = currentX + questionWidth + 65;
      const answerY = currentY - 22;
      const answerRectWidth = answerWidth;
      const answerRectHeight = 32;


      pdf.setLineWidth(1);
      pdf.setDrawColor(0,0,0);     
      pdf.rect(answerX, answerY, answerRectWidth, answerRectHeight);
      pdf.text(answer, answerX + 2, currentY);

      const quest = question.split(" X ");
      // console.log(quest);
      let finalAns = (parseInt(quest[0]) * parseInt(quest[1]))
      let finalAnss = JSON.stringify(finalAns)

      const itemPosition = {
        item: index+1,
        ans: [finalAnss],
        modelType: "mathpix",
        contentType: "question",
        contentSubType: "decimal",
        maxScore: 1,
        difficulty: 50,
        skills: [],
        qBox: [],
        ansBox: [
          {
              x: answerX,
              y: answerY,
              h: answerRectHeight,
              w: answerRectWidth,
              boxType: 'answer',
              id : crypto.randomUUID()
            }
        ],
        id: crypto.randomUUID(),
        orientation: "ltr",
        rubric: "",
        question: "",
        language: "english"
      };
      itemPositions.push(itemPosition);
    });

    pdf.setLineWidth(3);
    pdf.setDrawColor(120, 120, 120);
    pdf.line(0, 780, 599, 780);

    const widthFactor = 827 / 595.28;
    const heightFactor = 1170 / 841.89;
    
    itemPositions.forEach((obj: any) => {
      // tileHeight and tileWidth  H: 841.89 W: 595.28
      // imageWidth = 827, imageHeight = 1170
      obj.ansBox[0].x = Math.round(obj.ansBox[0].x * widthFactor);
      obj.ansBox[0].y = Math.round(obj.ansBox[0].y * heightFactor);
      obj.ansBox[0].w = Math.round(obj.ansBox[0].w * widthFactor);
      obj.ansBox[0].h = Math.round(obj.ansBox[0].h * heightFactor);
      
    });
    console.log(itemPositions,"final")      
    const jsonMetaData = JSON.stringify(itemPositions);
    console.log(jsonMetaData,"JMD")

    // factorizeCoordinates(itemPositions,1170,827,841,595)
    

    
    const qrCodeSize = 50; 
    pdf.addImage(qrCodes[0], 'PNG', 10, 10, qrCodeSize, qrCodeSize); 
    pdf.addImage(qrCodes[1], 'PNG', pdf.internal.pageSize.getWidth() - qrCodeSize - 10, 10, qrCodeSize, qrCodeSize); 
    pdf.addImage(qrCodes[2], 'PNG', 10, pdf.internal.pageSize.getHeight() - qrCodeSize - 10, qrCodeSize, qrCodeSize); 
    pdf.addImage(qrCodes[3], 'PNG', pdf.internal.pageSize.getWidth() - qrCodeSize - 10, pdf.internal.pageSize.getHeight() - qrCodeSize - 10, qrCodeSize, qrCodeSize); 
  
    let newImage = new Image();
    newImage.src = imageUrl;
    pdf.addImage(newImage,"JPEG",260,805,65,18);

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    setPdfUrl(pdfUrl);
  
    console.log(itemPositions);
  };
  

  
  return(
    <>
      <div className="App" id="section-to-print">
      <h1>Multiply multiples of 10 and 1 digit numbers</h1>
      <h5>Find the product</h5>
      <br />
      <div>
        <h5>NAME: ______________</h5>
        <h5>ROLL NO.: ______________</h5>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: 4 }}>
        {jsonData.map((item, index) => (
          <PdfItem key={index} question={item.question} answer={item.answer} />
        ))}
      </div>
    </div>
    
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <button onClick={handleGeneratePDF}>Generate PDF</button>
    </div>
    {pdfUrl && (
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h2>PDF Preview:</h2>
        {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
        <iframe src={pdfUrl} width="100%" height="600px"></iframe>
      </div>
    )}
  
    </>
  )

}


// const handleGeneratePDF = () => {
  //   const pdf = new jsPDF('p', 'pt', 'a4');
    
  //   const startX1 = 50;
  //   const startX2 = 220;
  //   const startX3 = 390;
  //   let startY = 80;
  
  //   pdf.setFontSize(18).setFont("helvetica","bold");;
  //   pdf.text('Multiply multiples of 10 and 1 digit numbers', startX1, startY);
  //   startY += 30;
  

  //   pdf.setFontSize(12).setFont("helvetica","bold");;
  //   pdf.text('NAME:', startX1, startY);
  //   pdf.rect(startX1+50,startY-14,150,18)
  //   startY += 30;
  //   pdf.text('ROLL NO: ', startX1, startY);
  //   pdf.rect(startX1+70,startY-14,70,18)
  //   // startY += 50;
  
  //   const itemPositions:any = []; 
    
  //   let currentY = startY + 20;
    
  //   jsonData.forEach((item, index) => {
  //     const { question, answer } = item;
  
  //     let currentX;
  

  //     if (index % 3 === 0) {
  //       currentY += 30
  //       // currentY = startY + (index / 3) * 30;
  //       currentX = startX1;
  //     } else if (index % 3 === 1) {
  //       // currentY = startY + Math.floor(index / 3) * 30;
  //       currentX = startX2;
  //     } else {
  //       // currentY = startY + Math.floor(index / 3) * 30;
  //       currentX = startX3;
  //     }
  
  //     const questionWidth = pdf.getTextWidth(question);
  //     const answerWidth = 70; 
  
  //     pdf.setFontSize(12).setFont("helvetica","normal");
  //     pdf.text(`${index}`, currentX, currentY);
  
  //     const answerX = currentX + questionWidth + 10; 
  //     const answerY = currentY - 12; 
  //     const answerRectWidth = answerWidth;
  //     const answerRectHeight = 16; 
  
  //     pdf.rect(answerX, answerY, answerRectWidth, answerRectHeight,);
  //     pdf.text(answer, answerX + 2, currentY);
  
  //     const itemPosition = {
  //       answer: {
  //         x: answerX,
  //         y: answerY,
  //         width: answerRectWidth,
  //         height: answerRectHeight,
  //       },
  //     };
  
  //     itemPositions.push(itemPosition); 
  //   });
  
  //   const pdfBlob = pdf.output('blob');
  //   const pdfUrl = URL.createObjectURL(pdfBlob);
  //   setPdfUrl(pdfUrl);
  
  //   console.log(itemPositions); 
  // };
  

  // const handleGeneratePDF = async () => {
  //   const pdf = new jsPDF('p', 'pt', 'a4');
  
  //   let startX = 50; // Starting X position for the text
  //   let startY = 80; // Starting Y position for the text
  
  //   pdf.setFontSize(18).setFont("helvetica","bold");
  //   pdf.text('Multiply multiples of 10 and 1 digit numbers', startX, startY);
  //   startY += 30;
    
  //   pdf.setFontSize(14).setFont("helvetica","bold");
  //   pdf.text("Find the product",startX,startY);
  //   startY += 30;

  //   pdf.setFontSize(12).setFont("helvetica","normal");
  //   pdf.text('NAME: ______________', startX, startY);
  //   startY += 20;
  //   pdf.text('ROLL NO.: ______________', startX, startY);
  //   startY += 30;

  //   // Generate QR codes
  //   const qrCodes = await Promise.all([
  //     QRCode.toDataURL('https://example.com/qr1'), // QR code 1 data
  //     QRCode.toDataURL('https://example.com/qr2'), // QR code 2 data
  //     QRCode.toDataURL('https://example.com/qr3'), // QR code 3 data
  //     QRCode.toDataURL('https://example.com/qr4'), // QR code 4 data
  //   ]);

  //   const itemPositions:any = []
  //   let currentY = startY + 20;

  //   // Add items from jsonData
  //   jsonData.forEach((item, index) => {
  //     const { question } = item;

  //     let currentX;
  
  //     pdf.text(question, startX, startY);
  //     // pdf.text(answer, startX + 100, startY);
  
  //     if(index%2===0){
  //       startX += 300;
  //     }
  //     else{
  //       startX = 50;
  //       startY += 30;
  //     }

  //     const questionWidth = pdf.getTextWidth(question);
      
  //     pdf.rect(startX+questionWidth+10,startY-7,100, 14,)
      
  //     const itemPosition = {
  //         x: startX+questionWidth+10,
  //         y: startY-7,
  //         width: 100,
  //         height: 14,
  //     }


  //     itemPositions.push(itemPosition);
  //   });

  //   // Add QR codes to the four corners
  //   const qrCodeSize = 50; // Size of the QR codes
  //   pdf.addImage(qrCodes[0], 'PNG', 10, 10, qrCodeSize, qrCodeSize); // Top-left corner
  //   pdf.addImage(qrCodes[1], 'PNG', pdf.internal.pageSize.getWidth() - qrCodeSize - 10, 10, qrCodeSize, qrCodeSize); // Top-right corner
  //   pdf.addImage(qrCodes[2], 'PNG', 10, pdf.internal.pageSize.getHeight() - qrCodeSize - 10, qrCodeSize, qrCodeSize); // Bottom-left corner
  //   pdf.addImage(qrCodes[3], 'PNG', pdf.internal.pageSize.getWidth() - qrCodeSize - 10, pdf.internal.pageSize.getHeight() - qrCodeSize - 10, qrCodeSize, qrCodeSize); // Bottom-right corner


  //   console.log(itemPositions)
  
  //   const pdfBlob = pdf.output('blob');
  //   const pdfUrl = URL.createObjectURL(pdfBlob);
  //   setPdfUrl(pdfUrl);

  // };  


// export default function App() {

//   const [pdfUrl, setPdfUrl] = useState('');

//   const handleGeneratePDF = () => {
//     const input:any = document.getElementById('section-to-print');
//     const pdf = new jsPDF('p', 'pt', 'a4');

//     const scale = 8; // Adjust the scaling factor as needed
  
//     html2canvas(input, { scale })
//       .then((canvas) => {
//         const imgData = canvas.toDataURL('image/png');
//         const imgWidth = 595.28;
//         const pageHeight = 841.89;
//         const imgHeight = (canvas.height * imgWidth) / canvas.width;
//         let heightLeft = imgHeight;
//         let position = 0;
  
//         pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//         heightLeft -= pageHeight;
  
//         while (heightLeft >= 0) {
//           position = heightLeft - imgHeight;
//           pdf.addPage();
//           pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
//           heightLeft -= pageHeight;
//         }
  
//         const pdfBlob = pdf.output('blob');
//         const pdfUrl = URL.createObjectURL(pdfBlob);
//         setPdfUrl(pdfUrl);
//       })
//       .catch((error) => {
//         console.log(error);
//       });
//   };
  

//   return (
//    <>
//     <div className="App" id="section-to-print" 
//     // ref={pdfRef}
//     >
//       <h1>Multiply multiples of 10 and 1 digit numbers</h1>
//       <h5>Find the product</h5>
//       <br/>
//       <div>
//       <h5 style={{}}>NAME: ______________</h5>
//       <h5 style={{}}>ROLL NO.: ______________</h5>
//       </div>
//       <div style={{display: 'flex',flexDirection:'column',padding:4,}}>
//         <div style={{display:'flex', flexDirection:'row',justifyContent:'center',gap:'20rem'}}>
//           <div>3 X 70 = </div>
//           <div>30 X 7 = </div>
//         </div>
//         <div style={{display:'flex', flexDirection:'row',justifyContent:'center',gap:'20rem'}}>
//           <div>40 X 6 = </div>
//           <div>3 X 50 = </div>
//         </div>
//         <div style={{display:'flex', flexDirection:'row',justifyContent:'center',gap:'20rem'}}>
//           <div>30 X 9 = </div>
//           <div>5 X 50 = </div>
//         </div>
//         <div style={{display:'flex', flexDirection:'row',justifyContent:'center',gap:'20rem'}}>
//           <div>70 X 6 = </div>
//           <div>9 X 60 = </div>
//         </div>
//         <div style={{display:'flex', flexDirection:'row',justifyContent:'center',gap:'20rem'}}>
//           <div>7 X 60 = </div>
//           <div>2 X 70 = </div>
//         </div>
//         <div style={{display:'flex', flexDirection:'row',justifyContent:'center',gap:'20rem'}}>
//           <div>80 X 5 = </div>
//           <div>8 X 70 = </div>
//         </div>
//       </div>
//     </div>
//     <div style={{ display: 'flex', justifyContent: 'center' }}>
//   <button onClick={handleGeneratePDF}>Generate PDF</button>
//   </div>
//   {pdfUrl && (
//     <div style={{ marginTop: '20px', textAlign: 'center' }}>
//       <h2>PDF Preview:</h2>
//       {/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
//       <iframe src={pdfUrl} width="100%" height="500px"></iframe>
//     </div>
//   )}
// </>
//   );
// }