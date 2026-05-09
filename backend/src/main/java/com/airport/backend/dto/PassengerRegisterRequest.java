package com.airport.backend.dto;

public class PassengerRegisterRequest {
    private String firstName;
    private String lastName;
    private String email;
    private String phoneNumber;
    private String dob;
    private String passportNo;
    private String username;
    private String password;

    // Getters and Setters
    public String getFirstName() { 
        return firstName; 
    }
    
    public void setFirstName(String firstName) { 
        this.firstName = firstName; // The missing dot is fixed here!
    }
    
    public String getLastName() { 
        return lastName; 
    }
    
    public void setLastName(String lastName) { 
        this.lastName = lastName; 
    }
    
    public String getEmail() { 
        return email; 
    }
    
    public void setEmail(String email) { 
        this.email = email; 
    }
    
    public String getPhoneNumber() { 
        return phoneNumber; 
    }
    
    public void setPhoneNumber(String phoneNumber) { 
        this.phoneNumber = phoneNumber; 
    }
    
    public String getDob() { 
        return dob; 
    }
    
    public void setDob(String dob) { 
        this.dob = dob; 
    }
    
    public String getPassportNo() { 
        return passportNo; 
    }
    
    public void setPassportNo(String passportNo) { 
        this.passportNo = passportNo; 
    }
    
    public String getUsername() { 
        return username; 
    }
    
    public void setUsername(String username) { 
        this.username = username; 
    }
    
    public String getPassword() { 
        return password; 
    }
    
    public void setPassword(String password) { 
        this.password = password; 
    }
}