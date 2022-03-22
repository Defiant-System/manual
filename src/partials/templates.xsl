<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="sideBar">
	<ul>
		<xsl:for-each select="./*">
		<li>
			<xsl:attribute name="data-path"><xsl:value-of select="@path"/></xsl:attribute>
			<legend>
				<xsl:choose>
					<xsl:when test="count(./*) > 0">
						<span class="arrow"><svg><use href="#icon-arrow-right"/></svg></span>
					</xsl:when>
					<xsl:otherwise>
						<span class="blank"></span>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:value-of select="@name"/>
			</legend>
			<xsl:if test="count(./*) > 0">
				<div>
					<ul>
						<xsl:for-each select="./*">
							<li>
								<xsl:attribute name="data-path"><xsl:value-of select="@path"/></xsl:attribute>
								<xsl:value-of select="@name"/>
							</li>
						</xsl:for-each>
					</ul>
				</div>
			</xsl:if>
		</li>
		</xsl:for-each>
	</ul>
</xsl:template>

</xsl:stylesheet>
