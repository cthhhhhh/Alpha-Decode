package com.csd.cs203t1.shop;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/wardrobe")
public class WardrobeController {

    private final ShopService shopService;
    private final UserRepository userRepository;

    public WardrobeController(ShopService shopService, UserRepository userRepository) {
        this.shopService = shopService;
        this.userRepository = userRepository;
    }

    @PostMapping("/equip/{id}")
    public ResponseEntity<?> equipItem(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        try {
            ShopDTO.EquipResponse response = shopService.equipItem(user, id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/unequip/{slot}")
    public ResponseEntity<?> unequipSlot(@PathVariable String slot, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        try {
            ShopDTO.EquipResponse response = shopService.unequipSlot(user, slot);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
