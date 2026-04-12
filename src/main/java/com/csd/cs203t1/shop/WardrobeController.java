package com.csd.cs203t1.shop;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserService;

@RestController
@RequestMapping("/api/wardrobe")
public class WardrobeController {

    private final ShopService shopService;
    private final UserService userService;

    public WardrobeController(ShopService shopService, UserService userService) {
        this.shopService = shopService;
        this.userService = userService;
    }

    @PostMapping("/equipped-items/{id}")
    public ResponseEntity<?> equipItem(@PathVariable Long id) {
        User user = userService.getCurrentUserReadOnly();
        try {
            ShopDTO.EquipResponse response = shopService.equipItem(user, id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/equipped-slots/{slot}")
    public ResponseEntity<?> unequipSlot(@PathVariable String slot) {
        User user = userService.getCurrentUserReadOnly();
        try {
            ShopDTO.EquipResponse response = shopService.unequipSlot(user, slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
