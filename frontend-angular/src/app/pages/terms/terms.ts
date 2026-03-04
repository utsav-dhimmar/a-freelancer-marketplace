import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './terms.html',
  styleUrl: './terms.css',
})
export class TermsComponent {
  agreed = signal(false);

  terms = [
    {
      title: 'Platform Role',
      content:
        'FreelanceHub is strictly a marketplace platform that facilitates connections between freelancers and clients. We provide the digital space for interaction but are not a party to any agreements, contracts, or work delivered between users.',
    },
    {
      title: 'User Interactions',
      content:
        'The platform has no involvement in, and is not responsible for, the actual interactions, negotiations, or performance of services between freelancers and clients. All engagements are solely at the risk of the participating parties.',
    },
    {
      title: 'Harmful Material Policy',
      content:
        'We are fully committed to maintaining a safe environment for all parties. Posting harmful, illegal, or offensive material is strictly prohibited. We actively support users in reporting such content to ensure a professional marketplace.',
    },
    {
      title: 'Content Removal & Suspension',
      content:
        'The platform reserves the absolute right to remove any post, project, or user account that violates our safety guidelines or contains harmful material. This action may be taken at our sole discretion without prior notice.',
    },
    {
      title: 'General Conduct',
      content:
        'Users are expected to behave professionally, honor their commitments, and communicate respectfully. Failure to maintain these standards may result in limited access to platform features.',
    },
  ];
}
