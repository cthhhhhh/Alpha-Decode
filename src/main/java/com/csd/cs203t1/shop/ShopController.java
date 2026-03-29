package com.csd.cs203t1.shop;

import com.csd.cs203t1.user.User;
import com.csd.cs203t1.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/shop")
public class ShopController {

    private final ShopService shopService;
    private final UserRepository userRepository;

    public ShopController(ShopService shopService, UserRepository userRepository) {
        this.shopService = shopService;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<ShopDTO.ShopItemDTO>> getShopItems(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(shopService.getShopItems(user));
    }

    @PostMapping("/buy/{id}")
    public ResponseEntity<?> buyItem(@PathVariable Long id, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        try {
            ShopDTO.EquipResponse response = shopService.buyItem(user, id);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
