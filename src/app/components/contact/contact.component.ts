import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ContactService, ContactForm } from '../../services/contact.service';
import { PortfolioService } from '../../services/portfolio.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private contactService = inject(ContactService);
  private portfolioService = inject(PortfolioService);

  socialLinks = this.portfolioService.getSocialLinks();

  formData: ContactForm = {
    name: '',
    email: '',
    subject: '',
    message: '',
    budget: '',
    timeline: '',
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;
  errorMessage = '';

  budgetOptions = [
    'Under $5k', '$5k - $15k', '$15k - $50k', '$50k+', 'Let\'s discuss'
  ];

  timelineOptions = [
    'ASAP', '1-3 months', '3-6 months', '6+ months', 'Flexible'
  ];

  contactDetails = [
    { icon: 'fas fa-envelope', label: 'Email', value: 'rithikagrawal40@gmail.com', link: 'mailto:rithikagrawal40@gmail.com' },
    { icon: 'fas fa-map-marker-alt', label: 'Location', value: 'Pune, India', link: null },
    { icon: 'fas fa-clock', label: 'Availability', value: 'Open to opportunities', link: null },
    { icon: 'fab fa-linkedin', label: 'LinkedIn', value: '/in/rithik-agrawal', link: 'https://linkedin.com/in/rithik-agrawal' },
  ];

  async onSubmit(form: NgForm): Promise<void> {
    if (form.invalid) return;

    this.isSubmitting = true;
    this.submitError = false;

    this.contactService.sendEmail(this.formData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        form.resetForm();
        this.formData = { name: '', email: '', subject: '', message: '', budget: '', timeline: '' };
      },
      error: (err) => {
        this.isSubmitting = false;
        this.submitError = true;
        this.errorMessage = 'Failed to send message. Please try emailing directly at rithikagrawal40@gmail.com';
        console.error(err);
      }
    });
  }

  resetForm(): void {
    this.submitSuccess = false;
    this.submitError = false;
  }
}
