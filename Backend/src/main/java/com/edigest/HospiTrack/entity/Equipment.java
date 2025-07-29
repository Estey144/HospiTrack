package com.edigest.HospiTrack.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "EQUIPMENT")
public class Equipment {
    
    @Id
    @Column(name = "ID")
    private String id;
    
    @Column(name = "EQUIPMENT_NAME")
    private String equipmentName;
    
    @Column(name = "EQUIPMENT_TYPE")
    private String equipmentType;
    
    @Column(name = "MANUFACTURER")
    private String manufacturer;
    
    @Column(name = "MODEL")
    private String model;
    
    @Column(name = "CONDITION")
    private String condition;
    
    @Column(name = "PURCHASE_DATE")
    private String purchaseDate;
    
    @Column(name = "DEPARTMENT_ID")
    private String departmentId;
    
    @Column(name = "BRANCH_ID")
    private String branchId;
    
    @Column(name = "STATUS")
    private String status;
    
    @Column(name = "ACTIVE")
    private Boolean active = true;

    // Default constructor
    public Equipment() {}

    // Constructor with parameters
    public Equipment(String id, String equipmentName, String equipmentType, String manufacturer, 
                    String model, String condition, String purchaseDate, String departmentId, 
                    String branchId, String status) {
        this.id = id;
        this.equipmentName = equipmentName;
        this.equipmentType = equipmentType;
        this.manufacturer = manufacturer;
        this.model = model;
        this.condition = condition;
        this.purchaseDate = purchaseDate;
        this.departmentId = departmentId;
        this.branchId = branchId;
        this.status = status;
        this.active = true;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEquipmentName() { return equipmentName; }
    public void setEquipmentName(String equipmentName) { this.equipmentName = equipmentName; }

    public String getEquipmentType() { return equipmentType; }
    public void setEquipmentType(String equipmentType) { this.equipmentType = equipmentType; }

    public String getManufacturer() { return manufacturer; }
    public void setManufacturer(String manufacturer) { this.manufacturer = manufacturer; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(String purchaseDate) { this.purchaseDate = purchaseDate; }

    public String getDepartmentId() { return departmentId; }
    public void setDepartmentId(String departmentId) { this.departmentId = departmentId; }

    public String getBranchId() { return branchId; }
    public void setBranchId(String branchId) { this.branchId = branchId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
