import { Component } from '@angular/core';

interface Transaction {
  id: string;
  name: string;
  price: string;
  date: string;
  icon: string;
  iconBg: string;
}

@Component({
  selector: 'app-demo-card',
  templateUrl: './demo-card.component.html',
  styleUrl: './demo-card.component.css',
  standalone: true,
})
export class DemoCardComponent {
  transactions: Transaction[] = [
    {
      id: '1',
      name: 'Bill & Taxes',
      price: '-$154.50',
      date: 'Today, 16:36',
      icon: 'domain',
      iconBg: '#F4F7FE',
    },
    {
      id: '2',
      name: 'Car Energy',
      price: '-$40.50',
      date: '23 Jun, 13:06',
      icon: 'electric_car',
      iconBg: '#F4F7FE',
    },
    {
      id: '3',
      name: 'Design Course',
      price: '-$70.00',
      date: '21 Jun, 19:04',
      icon: 'school',
      iconBg: '#F4F7FE',
    },
  ];

  balance = '$25,215';
}
