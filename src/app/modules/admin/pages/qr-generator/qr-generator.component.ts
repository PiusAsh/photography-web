import { Component } from '@angular/core';
import { SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeComponent } from 'angularx-qrcode';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';



@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule, QRCodeComponent],
  templateUrl: './qr-generator.component.html',
})
export class QrGeneratorComponent {
  public qrCodeDownloadLink: SafeUrl = "";
  public qrdata: string = '';

  constructor() { }

  onChangeURL(url: SafeUrl) {
    this.qrCodeDownloadLink = url;
  }

 

  // downloadQRCode() {
  //   const a = document.createElement('a');
  //   a.href = this.qrCodeDownloadLink as string;
  //   a.download = 'qr-code.png';
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  // }

  downloadQRCode() {
  // create an image from the SVG data url
  const img = new Image();
  img.src = this.qrCodeDownloadLink as string;

  img.onload = () => {
    // create a canvas with same dimensions as the QR
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d')!;

    // draw SVG onto canvas
    ctx.drawImage(img, 0, 0);

    // convert canvas to PNG dataURL
    const pngUrl = canvas.toDataURL('image/png');

    const a = document.createElement('a');
    a.href = pngUrl;
    a.download = 'qr-code.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
}


downloadAsImage() {
  const qrContainer = document.querySelector(".qr-contain") as HTMLElement;
  html2canvas(qrContainer, { 
    scale: 4,
    backgroundColor: null  // <-- prevents html2canvas from adding white fill
  }).then((canvas) => {
    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, `QR Code.png`);
      }
    });
  });
}


}