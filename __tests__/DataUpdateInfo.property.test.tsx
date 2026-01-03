import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as fc from 'fast-check';
import DataUpdateInfo from '@/components/atoms/DataUpdateInfo';

/**
 * Feature: farmacia-popular-mvp, Property 68: Update date formatted in Brazilian format
 * 
 * For any valid date in YYYY-MM-DD format, when displayed by DataUpdateInfo,
 * the date should be formatted in Brazilian Portuguese format (DD/MM/YYYY)
 * 
 * Validates: Requirements 20.3
 */
describe('DataUpdateInfo - Property-Based Tests', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('Property 68: Update date formatted in Brazilian format', () => {
    fc.assert(
      fc.property(
        // Generate valid dates in YYYY-MM-DD format
        fc.date({ min: new Date('2000-01-01'), max: new Date('2099-12-31') }),
        (date) => {
          // Format date as YYYY-MM-DD
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const isoDate = `${year}-${month}-${day}`;

          // Set environment variable
          process.env.NEXT_PUBLIC_DATA_UPDATE_DATE = isoDate;

          // Render component
          const { unmount } = render(<DataUpdateInfo />);

          // Expected Brazilian format: DD/MM/YYYY
          const expectedText = `Dados atualizados em: ${day}/${month}/${year}`;

          // Verify the date is displayed in Brazilian format
          expect(screen.getByText(expectedText)).toBeInTheDocument();

          // Cleanup
          unmount();
        }
      ),
      { numRuns: 100 } // Run 100 iterations as specified in design doc
    );
  });

  it('Property: Date format maintains leading zeros', () => {
    fc.assert(
      fc.property(
        // Generate dates with single-digit days and months
        fc.integer({ min: 2000, max: 2099 }),
        fc.integer({ min: 1, max: 9 }), // Single digit month
        fc.integer({ min: 1, max: 9 }), // Single digit day
        (year, month, day) => {
          // Ensure valid date
          const maxDay = new Date(year, month, 0).getDate();
          if (day > maxDay) {
            day = maxDay;
          }

          const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          process.env.NEXT_PUBLIC_DATA_UPDATE_DATE = isoDate;

          const { unmount } = render(<DataUpdateInfo />);

          // Verify leading zeros are present in Brazilian format
          const displayedText = screen.getByText(/Dados atualizados em:/);
          const dateMatch = displayedText.textContent?.match(/(\d{2})\/(\d{2})\/(\d{4})/);

          expect(dateMatch).not.toBeNull();
          if (dateMatch) {
            // Verify day and month have exactly 2 digits
            expect(dateMatch[1]).toHaveLength(2);
            expect(dateMatch[2]).toHaveLength(2);
            expect(dateMatch[3]).toHaveLength(4);
          }

          unmount();
        }
      ),
      { numRuns: 100 }
    );
  });
});
