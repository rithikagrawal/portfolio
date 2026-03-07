import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  budget?: string;
  timeline?: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  // EmailJS configuration - replace with your actual IDs
  private emailjsServiceId = 'YOUR_EMAILJS_SERVICE_ID';
  private emailjsTemplateId = 'YOUR_EMAILJS_TEMPLATE_ID';
  private emailjsPublicKey = 'YOUR_EMAILJS_PUBLIC_KEY';

  constructor(private http: HttpClient) {}

  sendEmail(formData: ContactForm): Observable<any> {
    const payload = {
      service_id: this.emailjsServiceId,
      template_id: this.emailjsTemplateId,
      user_id: this.emailjsPublicKey,
      template_params: {
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        budget: formData.budget || 'Not specified',
        timeline: formData.timeline || 'Not specified',
        to_name: 'Rithik Agrawal',
        reply_to: formData.email,
      }
    };

    return this.http.post('https://api.emailjs.com/api/v1.0/email/send', payload);
  }
}
