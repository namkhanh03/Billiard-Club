package com.example.bidashop.repository;

import com.example.bidashop.model.FacilityUser;
import com.example.bidashop.model.Facility;
import com.example.bidashop.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacilityUserRepository extends JpaRepository<FacilityUser, Long> {
    @Query("SELECT fu FROM FacilityUser fu WHERE fu.user.userId = :userId")
    List<FacilityUser> findByUserId(@Param("userId") Long userId);

    List<FacilityUser> findByUser(User user);

    List<FacilityUser> findByFacility(Facility facility);

    void deleteByUserAndFacility(User user, Facility facility);

    void deleteByUser(User user);

    @Query("SELECT f.id FROM Facility f JOIN FacilityUser fu ON fu.facility.id = f.id WHERE fu.user.id = :userId")
    List<Long> findFacilityIdsByUser(@Param("userId") Long userId);
}
