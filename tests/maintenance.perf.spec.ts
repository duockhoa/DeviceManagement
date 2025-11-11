import { test, expect } from '@playwright/test';
import { devices } from '@playwright/test';

// Performance Testing
test.describe('Maintenance Module Performance Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/maintenance');
    });

    test('Thời gian tải trang ban đầu', async ({ page }) => {
        const startTime = Date.now();
        await page.goto('/maintenance');
        const loadTime = Date.now() - startTime;
        
        // Kiểm tra thời gian tải trang < 2 giây
        expect(loadTime).toBeLessThan(2000);
    });

    test('Thời gian phản hồi của bảng dữ liệu', async ({ page }) => {
        const startTime = Date.now();
        await page.click('[data-testid="maintenance-table"]');
        await page.waitForSelector('.ant-table-row');
        const responseTime = Date.now() - startTime;
        
        // Kiểm tra thời gian phản hồi < 1 giây
        expect(responseTime).toBeLessThan(1000);
    });

    test('Memory usage khi scroll', async ({ page }) => {
        const metrics = [];
        
        // Thu thập metrics trong quá trình scroll
        for (let i = 0; i < 5; i++) {
            await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
            const performanceMetrics = await page.metrics();
            metrics.push(performanceMetrics.JSHeapUsedSize);
            await page.waitForTimeout(1000);
        }

        // Kiểm tra memory leak
        const memoryIncrease = metrics[metrics.length - 1] - metrics[0];
        expect(memoryIncrease).toBeLessThan(50 * 1024 * 1024); // < 50MB
    });
});

// Load Testing
test.describe('Load Testing', () => {
    test('Xử lý nhiều records', async ({ page }) => {
        // Load 1000 records
        await page.route('**/api/maintenance', (route) => {
            const records = Array.from({ length: 1000 }, (_, i) => ({
                id: i,
                deviceName: `Device ${i}`,
                status: 'pending',
                maintenanceDate: new Date().toISOString()
            }));
            route.fulfill({
                status: 200,
                body: JSON.stringify(records)
            });
        });

        const startTime = Date.now();
        await page.goto('/maintenance');
        await page.waitForSelector('.ant-table-row');
        const loadTime = Date.now() - startTime;

        // Kiểm tra thời gian tải < 3 giây cho 1000 records
        expect(loadTime).toBeLessThan(3000);
    });

    test('Concurrent requests', async ({ page }) => {
        const requests = [];
        page.on('request', request => requests.push(request));

        await page.goto('/maintenance');
        
        // Thực hiện nhiều actions cùng lúc
        await Promise.all([
            page.click('[data-testid="refresh-btn"]'),
            page.click('[data-testid="filter-btn"]'),
            page.click('[data-testid="export-btn"]')
        ]);

        // Kiểm tra xử lý concurrent requests
        expect(requests.filter(r => r.resourceType() === 'xhr').length).toBeGreaterThan(0);
    });
});

// Cross-browser Testing
const browsers = [
    devices['Desktop Chrome'],
    devices['Desktop Firefox'],
    devices['Desktop Safari'],
    devices['iPhone 12'],
    devices['Pixel 5']
];

for (const device of browsers) {
    test.describe(`Browser Tests - ${device.name}`, () => {
        test.use({ ...device });

        test('Responsive layout', async ({ page }) => {
            await page.goto('/maintenance');
            
            // Kiểm tra các elements quan trọng visible
            await expect(page.locator('[data-testid="maintenance-table"]')).toBeVisible();
            await expect(page.locator('[data-testid="filters-section"]')).toBeVisible();
            await expect(page.locator('[data-testid="actions-section"]')).toBeVisible();
        });

        test('Interactive elements', async ({ page }) => {
            await page.goto('/maintenance');
            
            // Kiểm tra các interactive elements hoạt động
            await expect(page.locator('button')).toBeEnabled();
            await expect(page.locator('input')).toBeEnabled();
            await expect(page.locator('select')).toBeEnabled();
        });
    });
}

// Accessibility Testing
test.describe('Accessibility Tests', () => {
    test('WCAG compliance', async ({ page }) => {
        await page.goto('/maintenance');
        
        // Kiểm tra các violations
        const violations = await page.evaluate(async () => {
            const { axe } = await import('@axe-core/playwright');
            return await axe(document);
        });

        expect(violations.length).toBe(0);
    });

    test('Keyboard navigation', async ({ page }) => {
        await page.goto('/maintenance');
        
        // Test tab navigation
        await page.keyboard.press('Tab');
        await expect(page.locator(':focus')).toBeVisible();
        
        // Test keyboard shortcuts
        await page.keyboard.press('Control+F');
        await expect(page.locator('[data-testid="search-input"]')).toBeFocused();
    });

    test('Screen reader support', async ({ page }) => {
        await page.goto('/maintenance');
        
        // Kiểm tra aria labels
        await expect(page.locator('[aria-label]')).toHaveCount(expect.toBeGreaterThan(0));
        await expect(page.locator('[role]')).toHaveCount(expect.toBeGreaterThan(0));
    });
});