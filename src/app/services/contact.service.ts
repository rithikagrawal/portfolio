import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from } from 'rxjs';

import { environment } from '../../environments/environment';

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
  // EmailJS configuration
  private emailjsServiceId = environment.emailjsServiceId;
  private emailjsTemplateId = environment.emailjsTemplateId;
  private emailjsPublicKey = environment.emailjsPublicKey;

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

    return this.http.post('https://api.emailjs.com/api/v1.0/email/send', payload, { responseType: 'text' as 'json' });
  }
}
