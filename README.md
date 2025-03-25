
# Bistro Boardroom - Employee Management System


Bistro Boardroom is a comprehensive employee management system designed for restaurant and bistro businesses. It provides tools for managing employees, scheduling shifts, tracking attendance, processing payroll, and generating reports.

## ✨ Features

### Admin Features
- **Dashboard**: Overview of key metrics including employee count, active shifts, and scheduled hours
- **Employee Management**: Add, edit, and remove employees with real-time updates
- **Shift Scheduling**: Create and manage employee work schedules with drag-and-drop interface
- **Attendance Tracking**: Monitor employee check-ins, check-outs, and absences with detailed logs
- **Leave Management**: Review and approve employee leave requests
- **Overtime Management**: Track and approve overtime hours with automated calculations
- **Payroll Processing**: Calculate and manage employee salaries with detailed breakdowns
- **Reporting**: Generate reports on attendance, performance, and costs with exportable data

### Employee Features
- **Dashboard**: View upcoming shifts and important notices at a glance
- **Shift Management**: See assigned shifts and schedule with detailed information
- **Attendance**: Clock in/out and view attendance history with time tracking
- **Leave Requests**: Submit and track leave requests with approval status
- **Profile Management**: Update personal information and preferences

## 🚀 Technical Features

- **Responsive Design**: Fully responsive UI that works seamlessly on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between dark and light themes based on user preference
- **Loading Animations**: Smooth loading states and transitions between pages
- **Scroll Animations**: Elements animate into view as users scroll through content
- **Modern UI Components**: Built with Shadcn UI for a polished, consistent interface
- **Type Safety**: Built with TypeScript for better code quality and developer experience
- **State Management**: Context API for global state management
- **Authentication**: Secure login and role-based access control
- **Accessibility**: ARIA-compliant components and keyboard navigation

## 🛠️ Getting Started

### Prerequisites

- Node.js 16.x or later
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/bistro-boardroom.git
   cd bistro-boardroom
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser to `http://localhost:5173`

## 📱 User Guide

### Admin Guide

1. **Dashboard**
   - View key metrics at a glance with interactive charts
   - Access quick actions for common tasks
   - Monitor bonus eligibility for employees with status indicators

2. **Employee Management**
   - Add new employees with required details
   - Edit existing employee information
   - Deactivate or remove employees when needed
   - Filter and search employees by various criteria

3. **Shift Scheduling**
   - Create weekly or daily shift schedules with intuitive interface
   - Assign shifts to specific employees with drag-and-drop
   - View and edit shifts by day or employee
   - Export schedule for distribution
   - Handle conflicts and overlapping shifts

4. **Attendance Management**
   - View daily attendance records with filtering options
   - Mark employees as absent when needed
   - Edit attendance records to adjust late minutes or overtime
   - Add notes to attendance records
   - Generate attendance reports by date range

5. **Leave Management**
   - Review pending leave requests in the approval queue
   - Approve or deny requests with comments
   - View leave history for employees
   - Set leave policies and quotas

6. **Payroll Processing**
   - Generate payroll for specified period with detailed calculations
   - View salary details for all employees
   - Apply bonuses or deductions
   - Approve and finalize payments
   - Export payroll reports for accounting

### Employee Guide

1. **Dashboard**
   - View upcoming shifts with status indicators
   - Check important notices and announcements
   - Monitor hours worked this month with progress visualization

2. **Shift Management**
   - View assigned shifts for the week/month in calendar view
   - See shift details including time, position, and location
   - Request shift changes or swaps

3. **Attendance**
   - Clock in at shift start with geolocation verification
   - Clock out at shift end with automated time calculation
   - View attendance history and records
   - Check punctuality statistics

4. **Leave Requests**
   - Submit new leave requests with date range and reason
   - View status of pending requests
   - See history of past requests
   - Check remaining leave balance

5. **Profile**
   - Update personal information and contact details
   - Change password and security settings
   - Set notification preferences
   - View employment history and documents

## 🎨 UI/UX Features

- **Smooth Transitions**: Page transitions and component animations provide a polished feel
- **Interactive Components**: Hover effects, click animations, and feedback for user actions
- **Skeleton Loading**: Content placeholders during data fetching for improved perceived performance
- **Toast Notifications**: Non-intrusive notifications for actions and updates
- **Micro-interactions**: Small animations and effects that enhance the user experience
- **Consistent Design Language**: Uniform spacing, colors, and typography throughout the application

## 🔒 Authentication and Security

- **Role-based Access**: Different permissions for admin and employee roles
- **Secure Login**: Protection against common authentication vulnerabilities
- **Session Management**: Proper handling of user sessions and timeouts
- **Input Validation**: Client and server-side validation of user inputs

## 📊 Data Visualization

- **Charts and Graphs**: Visual representation of key metrics and data
- **Interactive Reports**: Filter, sort, and export data for analysis
- **Dashboard Widgets**: Customizable widgets for important information

## 🔧 Troubleshooting

If you encounter any issues:

1. **Authentication Problems**:
   - Ensure you're using the correct credentials
   - Check your account role permissions
   - Clear browser cache and cookies

2. **Display Issues**:
   - Ensure your browser is updated to the latest version
   - Try different browsers (Chrome, Firefox, Safari)
   - Check if your device meets the minimum requirements

3. **Data Not Loading**:
   - Check your internet connection
   - Verify that the server is running correctly
   - Look for console errors in browser developer tools

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Icons by [Lucide Icons](https://lucide.dev)
- UI Components by [Shadcn UI](https://ui.shadcn.com)
- Charts by [Recharts](https://recharts.org)

---

&copy; 2024 Bistro Boardroom. All rights reserved to Prabhath.
