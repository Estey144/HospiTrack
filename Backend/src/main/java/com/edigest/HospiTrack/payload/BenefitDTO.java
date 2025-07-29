package com.edigest.HospiTrack.payload;

import java.util.List;

public class BenefitDTO {
    private String category;
    private List<BenefitItem> items;

    // Constructors
    public BenefitDTO() {}

    // Getters and Setters
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public List<BenefitItem> getItems() { return items; }
    public void setItems(List<BenefitItem> items) { this.items = items; }

    // Inner class for benefit items
    public static class BenefitItem {
        private String service;
        private String coverage;
        private String copay;

        public BenefitItem() {}

        public BenefitItem(String service, String coverage, String copay) {
            this.service = service;
            this.coverage = coverage;
            this.copay = copay;
        }

        // Getters and Setters
        public String getService() { return service; }
        public void setService(String service) { this.service = service; }

        public String getCoverage() { return coverage; }
        public void setCoverage(String coverage) { this.coverage = coverage; }

        public String getCopay() { return copay; }
        public void setCopay(String copay) { this.copay = copay; }
    }
}