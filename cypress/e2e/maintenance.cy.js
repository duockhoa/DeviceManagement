describe('Maintenance Module Tests', () => {
    beforeEach(() => {
        // Truy cập trang bảo trì
        cy.visit('/maintenance');
        // Login nếu cần
        cy.login('admin', 'password');
    });

    it('Hiển thị danh sách bảo trì', () => {
        cy.get('.maintenance-table').should('exist');
        cy.get('.ant-table-row').should('have.length.at.least', 1);
    });

    it('Tạo mới lịch bảo trì', () => {
        // Click nút thêm mới
        cy.get('[data-cy="add-maintenance-btn"]').click();

        // Điền form
        cy.get('[data-cy="device-name-input"]').type('Máy test');
        cy.get('[data-cy="maintenance-type-select"]').click();
        cy.get('.ant-select-item-option').contains('Định kỳ').click();
        cy.get('[data-cy="maintenance-date-picker"]').click();
        cy.get('.ant-picker-cell-selected').click();
        cy.get('[data-cy="priority-select"]').click();
        cy.get('.ant-select-item-option').contains('Cao').click();
        cy.get('[data-cy="description-input"]').type('Mô tả bảo trì test');

        // Submit form
        cy.get('[data-cy="submit-btn"]').click();

        // Kiểm tra thông báo thành công
        cy.get('.ant-message-success').should('contain', 'Tạo mới lịch bảo trì thành công');

        // Kiểm tra dữ liệu mới trong bảng
        cy.get('.ant-table-row').should('contain', 'Máy test');
    });

    it('Cập nhật lịch bảo trì', () => {
        // Click nút edit của record đầu tiên
        cy.get('[data-cy="edit-btn"]').first().click();

        // Cập nhật thông tin
        cy.get('[data-cy="device-name-input"]').clear().type('Máy test updated');
        cy.get('[data-cy="description-input"]').clear().type('Mô tả đã cập nhật');

        // Submit form
        cy.get('[data-cy="submit-btn"]').click();

        // Kiểm tra thông báo thành công
        cy.get('.ant-message-success').should('contain', 'Cập nhật lịch bảo trì thành công');

        // Kiểm tra dữ liệu đã cập nhật
        cy.get('.ant-table-row').first().should('contain', 'Máy test updated');
    });

    it('Xóa lịch bảo trì', () => {
        // Lưu số lượng record ban đầu
        cy.get('.ant-table-row').then($rows => {
            const initialCount = $rows.length;

            // Click nút xóa của record đầu tiên
            cy.get('[data-cy="delete-btn"]').first().click();

            // Xác nhận xóa
            cy.get('.ant-modal-confirm-btns .ant-btn-primary').click();

            // Kiểm tra thông báo thành công
            cy.get('.ant-message-success').should('contain', 'Xóa lịch bảo trì thành công');

            // Kiểm tra số lượng record đã giảm
            cy.get('.ant-table-row').should('have.length', initialCount - 1);
        });
    });

    it('Lọc và tìm kiếm', () => {
        // Test filter theo trạng thái
        cy.get('[data-cy="status-filter"]').click();
        cy.get('.ant-select-item-option').contains('Hoàn thành').click();
        cy.get('.ant-table-row').each($row => {
            cy.wrap($row).should('contain', 'Hoàn thành');
        });

        // Test tìm kiếm
        cy.get('[data-cy="search-input"]').type('Máy test');
        cy.get('.ant-table-row').each($row => {
            cy.wrap($row).should('contain', 'Máy test');
        });
    });

    it('Xuất báo cáo', () => {
        // Click nút xuất báo cáo
        cy.get('[data-cy="export-btn"]').click();

        // Kiểm tra file đã được tải xuống
        cy.readFile('cypress/downloads/bao-cao-bao-tri.xlsx').should('exist');
    });

    it('Kiểm tra biểu đồ thống kê', () => {
        // Chuyển sang tab thống kê
        cy.get('[data-cy="stats-tab"]').click();

        // Kiểm tra các thành phần thống kê
        cy.get('[data-cy="total-stats"]').should('exist');
        cy.get('[data-cy="completion-rate"]').should('exist');
        cy.get('[data-cy="priority-chart"]').should('exist');
        cy.get('[data-cy="status-chart"]').should('exist');
    });

    it('Kiểm tra responsive', () => {
        // Test trên mobile
        cy.viewport('iphone-x');
        cy.get('.ant-table-content').should('be.visible');
        cy.get('[data-cy="add-maintenance-btn"]').should('be.visible');

        // Test trên tablet
        cy.viewport('ipad-2');
        cy.get('.ant-table-content').should('be.visible');
        cy.get('.maintenance-dashboard').should('be.visible');

        // Test trên desktop
        cy.viewport(1920, 1080);
        cy.get('.maintenance-dashboard').should('be.visible');
        cy.get('.ant-table-content').should('be.visible');
    });
});