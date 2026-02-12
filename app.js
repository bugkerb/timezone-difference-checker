// Time Zone Difference Checker
(function() {
    'use strict';

    // DOM Elements
    const timezone1Select = document.getElementById('timezone1');
    const timezone2Select = document.getElementById('timezone2');
    const time1Display = document.getElementById('time1');
    const date1Display = document.getElementById('date1');
    const time2Display = document.getElementById('time2');
    const date2Display = document.getElementById('date2');
    const differenceDisplay = document.getElementById('difference');
    const differenceDetail = document.getElementById('difference-detail');

    // Format time
    function formatTime(date) {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });
    }

    // Format date
    function formatDate(date) {
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Get timezone offset in hours
    function getTimezoneOffset(timezone) {
        const now = new Date();
        const offsetMinutes = now.getTimezoneOffset();
        
        // Create date in the target timezone
        const options = { timeZone: timezone, timeZoneName: 'longOffset' };
        const offsetString = now.toLocaleString('en-US', options);
        
        // Extract offset from the string
        const match = offsetString.match(/GMT([+-]\d{2}):?(\d{2})?/);
        if (match) {
            const hours = parseInt(match[1]);
            const minutes = match[2] ? parseInt(match[2]) : 0;
            return hours + minutes / 60;
        }
        
        return 0;
    }

    // Format offset string
    function formatOffset(offset) {
        const hours = Math.floor(offset);
        const minutes = Math.abs((offset - hours) * 60);
        const sign = hours >= 0 ? '+' : '-';
        const absHours = Math.abs(hours);
        return `GMT${sign}${absHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    }

    // Calculate time difference
    function calculateDifference() {
        const tz1 = timezone1Select.value;
        const tz2 = timezone2Select.value;

        // Get current times in both timezones
        const now = new Date();
        
        const options = {
            timeZone: tz1,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };

        const options2 = {
            timeZone: tz2,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        };

        // Update displays
        const time1 = new Date(now.toLocaleString('en-US', options));
        const time2 = new Date(now.toLocaleString('en-US', options2));

        time1Display.textContent = formatTime(time1);
        date1Display.textContent = formatDate(time1);
        time2Display.textContent = formatTime(time2);
        date2Display.textContent = formatDate(time2);

        // Calculate difference in hours
        const offset1 = getTimezoneOffset(tz1);
        const offset2 = getTimezoneOffset(tz2);
        const diffHours = offset2 - offset1;

        // Display difference
        const absDiff = Math.abs(diffHours);
        const hours = Math.floor(absDiff);
        const minutes = Math.round((absDiff - hours) * 60);

        let diffText = '';
        if (diffHours === 0) {
            diffText = 'Same time';
        } else {
            const direction = diffHours > 0 ? 'ahead' : 'behind';
            if (minutes === 0) {
                diffText = `${hours} hour${hours > 1 ? 's' : ''} ${direction}`;
            } else {
                diffText = `${hours}h ${minutes}m ${direction}`;
            }
        }

        differenceDisplay.textContent = formatOffset(diffHours);
        differenceDetail.textContent = `${timezone1Select.options[timezone1Select.selectedIndex].text.split('(')[0].trim()} is ${diffText}`;
    }

    // Initial update
    calculateDifference();

    // Update every second
    setInterval(calculateDifference, 1000);

    // Event listeners
    timezone1Select.addEventListener('change', calculateDifference);
    timezone2Select.addEventListener('change', calculateDifference);
})();
