package com.airport.backend.entity;
import jakarta.persistence.*;

@Entity
@Table(name = "equipment")
public class Equipment {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long equipment_id;
    private String type;
    private String equipment_name;
    public Long getEquipment_id() {
        return equipment_id;
    }
    public void setEquipment_id(Long equipment_id) {
        this.equipment_id = equipment_id;
    }
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }
    public String getEquipment_name() {
        return equipment_name;
    }
    public void setEquipment_name(String equipment_name) {
        this.equipment_name = equipment_name;
    }
}